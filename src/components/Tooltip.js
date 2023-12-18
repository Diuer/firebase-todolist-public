import { Popup } from "semantic-ui-react";

function Tooltip({ title, content, ...props }) {
  return <Popup inverted {...props} content={title} trigger={content} />;
}

export default Tooltip;
