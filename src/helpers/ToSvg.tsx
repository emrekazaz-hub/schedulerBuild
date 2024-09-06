import React from 'react';
import { SvgXml } from 'react-native-svg';

// Define the props for the SvgComponent
interface SvgComponentProps {
  xml: string;
  width: number | string;
  height: number | string;
}

const SvgComponent: React.FC<SvgComponentProps> = ({ xml, width, height }) => {
  return <SvgXml xml={xml} width={width} height={height} />;
};

// Define the props for the ToSvg component
interface ToSvgProps {
  svgXml: string;
  width?: number | string;
  height?: number | string;
  color?: string | null;
}

const ToSvg: React.FC<ToSvgProps> = ({
  svgXml,
  width = 50,
  height = width,
  color = null,
}) => {
  let updatedSvgXml = svgXml;

  if (color) {
    updatedSvgXml = updatedSvgXml.replace(
      /(fill|stroke)="#\w+"/g,
      `$1="${color}"`
    );
  }

  return <SvgComponent xml={updatedSvgXml} width={width} height={height} />;
};

export default ToSvg;
