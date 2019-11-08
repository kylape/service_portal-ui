import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import EditPortfolioItem from './edit-portfolio-item';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';

const ItemDetailDescription = ({ product, url }) => (
  <Switch>
    <Route exact path={ `${url}` } render={ () => (
      <TextContent>
        { (product.description || product.long_description) && (
          <Text component={ TextVariants.h6 }>Overview</Text>
        ) }
        { product.description && (
          <Text component={ TextVariants.p }>{ product.description }</Text>
        ) }
        { product.long_description && (
          <Text component={ TextVariants.p }>{ product.long_description }</Text>
        ) }
        { product.support_url && (
          <Text component={ TextVariants.p }><a href={ product.support_url } target="_blank" rel="noopener noreferrer">Learn more</a></Text>
        ) }
        { product.documentation_url && (
          <Fragment>
            <Text component={ TextVariants.h6 }>Documentation</Text>
            <Text component={ TextVariants.p }>
              <a href={ product.documentation_url } target="_blank" rel="noopener noreferrer">Doc link</a>
            </Text>
          </Fragment>
        ) }
      </TextContent>
    ) }/>
    <Route exact path={ `${url}/edit` } render={ () => <EditPortfolioItem cancelUrl={ url } product={ product } /> } />
    <Route exact path={ `${url}/edit-workflow` }
      render={ () => <EditApprovalWorkflow closeUrl={ url } resource={ { type: 'portfolio-item', id: product.id } } /> } />
  </Switch>
);

ItemDetailDescription.propTypes = {
  product: PropTypes.shape({
    dscription: PropTypes.string,
    long_description: PropTypes.string,
    support_url: PropTypes.string,
    documentation_url: PropTypes.string
  }).isRequired,
  url: PropTypes.string.isRequired
};

export default ItemDetailDescription;
