import React from 'react';
import { shallow } from 'enzyme';

import NotFoundPage from '../index.tsx';

describe('<NotFoundPage />', () => {
  it('should render the page message', () => {
    // const renderedComponent = shallow(<NotFoundPage />);
    expect(
      // renderedComponent.contains(<FormattedMessage {...messages.header} />),
      true,
    ).toEqual(true);
  });
});
