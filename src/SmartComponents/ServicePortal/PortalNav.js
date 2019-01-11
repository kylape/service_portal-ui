import React from 'react';
import propTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, NavGroup, NavItem } from '@patternfly/react-core';
import { fetchPlatforms } from '../../redux/Actions/PlatformActions';
import { fetchPortfolios } from '../../redux/Actions/PortfolioActions';
import { toggleEdit } from '../../redux/Actions/UiActions';
import './portalnav.scss';

const PLATFORMS_URL_BASE = '/platforms';
const PLATFORM_URL_BASE = '/platform';
const PORTFOLIOS_URL_BASE = '/portfolios';
const PORTFOLIO_URL_BASE = '/portfolio';

class PortalNav extends React.Component {

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
  // TODO - only call if the user is an admin
    this.props.fetchPlatforms();
    this.props.fetchPortfolios();
  }

  platformNavItems = () => this.props.platforms.map(item => (
    <NavItem key={ item.id } id={ item.id } groupId="platforms">
      <NavLink to={ `${PLATFORM_URL_BASE}/${item.id}` }>
        { item.name }
      </NavLink>
    </NavItem>
  ));

  portfolioNavItems = () => this.props.portfolios.map(item => (
    <NavItem key={ item.id } id={ item.id }>
      <NavLink to={ `${PORTFOLIO_URL_BASE}/${item.id}` }>
        { item.name }
      </NavLink>
    </NavItem>
  ));

  render() {
    return (
      <Nav aria-label="Service Portal" className="portal-nav">
        <NavGroup title="Platforms">
          <NavItem key='all' id="all-platforms">
            <NavLink exact to={ PLATFORMS_URL_BASE }>
                    All Platforms
            </NavLink>
          </NavItem>
          { this.platformNavItems() }
        </NavGroup>
        <NavGroup title="Portfolios">
          <NavItem key='all' id="all-portfolios">
            <NavLink exact to={ PORTFOLIOS_URL_BASE }>
              All Portfolios
            </NavLink>
          </NavItem>
          { this.portfolioNavItems() }
        </NavGroup>
      </Nav>
    );
  }
}

const mapStateToProps = ({
  platformReducer: { platforms, isPlatformDataLoading },
  portfolioReducer: { isLoading, portfolios }
}) => ({
  isPlatformDataLoading,
  platforms,
  isLoading,
  portfolios
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPlatforms,
  fetchPortfolios,
  toggleEdit
}, dispatch);

PortalNav.propTypes = {
  portfolios: propTypes.array,
  platforms: propTypes.array,
  isPlatformDataLoading: propTypes.bool,
  fetchPortfolios: propTypes.func,
  fetchPlatforms: propTypes.func,
  toggleEdit: propTypes.func,
  isLoading: propTypes.bool
};

PortalNav.defaultProps = {
  platforms: []
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalNav);
