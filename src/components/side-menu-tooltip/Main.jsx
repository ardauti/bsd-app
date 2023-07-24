import { useRef, createElement, useEffect } from "react";
import { Tippy } from "@/components";
import PropTypes from "prop-types";

const toggleTooltip = (el, opensidenav) => {
  if (opensidenav === 'false') {
    el._tippy.enable();
  } else if(dom(window).width() <= 768) {
    el._tippy.disable();
  } else  el._tippy.disable();
};

const initTooltipEvent = (tippyRef, opensidenav) => {
  window.addEventListener("resize", () => {
    toggleTooltip(tippyRef, opensidenav);
  });
};

function Main(props) {
  const tippyRef = useRef();

  useEffect(() => {
    toggleTooltip(tippyRef.current, props.opensidenav);
    initTooltipEvent(tippyRef.current, props.opensidenav);
  }, [tippyRef.current, props.opensidenav]);

  const { tag, ...computedProps } = props;
  return createElement(
    Tippy,
    {
      ...computedProps,
      tag: props.tag,
      options: { placement: "left" },
      getRef: (el) => {
        tippyRef.current = el;
      },
    },
    props.children
  );
}

Main.propTypes = {
  tag: PropTypes.string,
};

Main.defaultProps = {
  tag: "span",
};

export default Main;
