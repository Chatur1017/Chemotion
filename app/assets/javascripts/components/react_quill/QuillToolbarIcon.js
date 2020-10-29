import React from 'react';
import PropTypes from 'prop-types';

export default class QuillDynamicToolbarIcon extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { onClick } = this.props;
    if (onClick) onClick();
  }

  render() {
    const { icon } = this.props;
    if (React.isValidElement(icon)) {
      return (
        <button onClick={this.onClick}>
          {icon}
        </button>
      );
    }

    return (
      <button className={`ql_${icon}`}>
        <span>
          {icon.toUpperCase()}
        </span>
      </button>
    );
  }
}

QuillDynamicToolbarIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  onClick: PropTypes.func
};

QuillDynamicToolbarIcon.defaultProps = {
  icon: <span />,
  onClick: null
};
