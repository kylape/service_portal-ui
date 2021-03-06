import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import AddOrderProcessModal from '../../../smart-components/order-process/add-order-process-modal';
import { Button } from '@patternfly/react-core';
import { ORDER_PROCESSES_ROUTE } from '../../../constants/routes';
import * as validator from '../../../forms/name-async-validator';
import * as helpers from '../../../helpers/order-process/order-process-helper';
import * as actions from '../../../redux/actions/order-process-actions';

describe('<AddOrderProcess />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    initialState = {
      orderProcessReducer: {
        orderProcesses: {
          data: [
            { id: '123', name: 'foo', description: 'bar' },
            {
              id: '456',
              name: 'PrePostTest',
              description: 'PrePost',
              before_portfolio_item_id: 'pre',
              after_portfolio_item_id: 'post'
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);

    // mock async validator so no timers are used
    validator.default = jest.fn().mockImplementation(() => '');
  });

  it('should render correctly', async () => {
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      ).dive();
    });

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should close correctly', async () => {
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper
        .find(Button)
        .first()
        .simulate('click');
    });
    wrapper.update();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(ORDER_PROCESSES_ROUTE);
  });

  it('should submit new order process form correctly', async () => {
    helpers.addOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();

    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      const nameField = wrapper.find('input').first();
      nameField.instance().value = 'some-name';
      nameField.simulate('change');
    });
    wrapper.update();

    const id = null;
    const intl = expect.any(Object);
    expect(validator.default).toHaveBeenCalledWith('some-name', id, intl);

    await act(async () => {
      const descriptionField = wrapper.find('textarea');
      descriptionField.instance().value = 'some-description';
      descriptionField.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(helpers.addOrderProcess).toHaveBeenCalledWith({
      description: 'some-description',
      name: 'some-name'
    });
    expect(actions.fetchOrderProcesses).toHaveBeenCalled();
  });

  it('should edit order process correctly', async () => {
    helpers.updateOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();

    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/order-processes?order_process=123']}
        >
          <AddOrderProcessModal edit {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const id = '123';
    const intl = expect.any(Object);
    expect(validator.default).toHaveBeenCalledWith('foo', id, intl);

    await act(async () => {
      const descriptionField = wrapper.find('textarea');
      descriptionField.instance().value = 'some-description';
      descriptionField.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(helpers.updateOrderProcess).toHaveBeenCalledWith('123', {
      description: 'some-description',
      id: '123',
      name: 'foo'
    });
    expect(actions.fetchOrderProcesses).toHaveBeenCalled();
  });
});
