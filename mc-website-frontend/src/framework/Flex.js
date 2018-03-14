import PropTypes from 'prop-types';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection};
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  flex-wrap: ${props => props.flexWrap};
`;

Flex.propTypes = {
  flexDirection: PropTypes.string.isRequired,
  justifyContent: PropTypes.string.isRequired,
  alignItems: PropTypes.string.isRequired,
  flexWrap: PropTypes.string.isRequired,
};

Flex.defaultProps = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  flexWrap: 'nowrap',
};

export default Flex;
