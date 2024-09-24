import React from 'react';
import { SvgXml } from 'react-native-svg';

// Define the props for the SvgComponent

const SvgComponent = ({
  xml,
  width,
  height
}) => {
  return /*#__PURE__*/React.createElement(SvgXml, {
    xml: xml,
    width: width,
    height: height
  });
};

// Define the props for the ToSvg component

const ToSvg = ({
  svgXml,
  width = 50,
  height = width,
  color = null
}) => {
  let updatedSvgXml = svgXml;
  if (color) {
    updatedSvgXml = updatedSvgXml.replace(/(fill|stroke)="#\w+"/g, `$1="${color}"`);
  }
  return /*#__PURE__*/React.createElement(SvgComponent, {
    xml: updatedSvgXml,
    width: width,
    height: height
  });
};
export default ToSvg;
//# sourceMappingURL=ToSvg.js.map