"use client";

import { ComponentPropsWithRef, ElementType, Fragment, useEffect, useId, useRef, useState } from "react";
import styles from "./style.module.css";
import createCX from "classnames/bind";
import { FaCheck } from "react-icons/fa";
const cx = createCX.bind(styles);

type IgnoredProps =
  | "accept"
  | "capture"
  | "alt"
  | "src"
  | "height"
  | "width"
  | "multiple"
  | "min" | "max" | "step"
  | `${"min" | "max"}Length`
  | "pattern"
  | "placeholder"
  | "readOnly"
  | "size"
  | "list"
  | `form${"Action" | "EncType" | "Method" | "NoValidate" | "Target"}`
  | "enterKeyHint"
  | "inputMode"
  | "type";

type CheckboxPropsBase = Omit<ComponentPropsWithRef<"input">,IgnoredProps>;

type CheckboxProps = CheckboxPropsBase &
{
  label?:string
  labelIsHidden?:boolean
} & ( {
  checked?:boolean,
  onChange?:(v:boolean)=>void
  defaultChecked?:never
} | {
  checked?:never
  onChange?:never
  defaultChecked?:boolean
})

export default function Checkbox(
  {
    label,
    labelIsHidden = false,
    checked:controlledChecked, 
    onChange:controlledOnChange,
    defaultChecked = false,
    ...props
  }:CheckboxProps  
){

  const generatedId = useId();
  const id = props.id ?? generatedId;

  const ParentComponent = label ? "label"  : Fragment;
  const parentProps = label ? {
      htmlFor:props.id ?? id,
      className:cx("label")
  } : {}
  const checkboxRef = useRef<HTMLInputElement>(null);

  const isControlled = ( 
    controlledChecked != undefined && 
    controlledOnChange != undefined
  );
  /** 제어 모드가 바뀌어도 Hook 호출 순서를 유지합니다. */
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;
  const onChange = isControlled ? controlledOnChange : setInternalChecked;

  const [isMounted, mount] = useState<boolean>(false);
  useEffect(()=>{ if(!isMounted) mount(true); });
  useEffect(()=>{
    const hasComponentLabel = Boolean(label?.trim());

    const hasExternalLabel = Boolean(
      id && document.querySelector(
        `label[for="${CSS.escape(id)}"]`
      )
    );

    const labelledBy = props["aria-labelledby"];

    const hasValidLabelledBy = Boolean(
      labelledBy?.trim() &&
      labelledBy.trim().split(/\s+/).every(
        id => document.getElementById(id)
      )
    );

    if (props["aria-label"]) {
      console.warn(
        "[LabelWarning] aria-label is not supported. Use label with labelIsHidden instead."
      );
    }

    if (
      !hasComponentLabel &&
      !hasExternalLabel &&
      !hasValidLabelledBy
    ) {
      console.warn(
        "[LabelWarning] Checkbox requires an accessible label."
      );
    }

    if (labelledBy && !hasValidLabelledBy) {
      console.error(
        "[LabelError] aria-labelledby references a missing element."
      );
    }

    if (
      id &&
      document.querySelectorAll(`#${CSS.escape(id)}`).length > 1
    ) {
      console.error(
        `[IdentifierError] Duplicate id detected: ${id}`
      );
    }
  },[])

  return (
    <ParentComponent {...parentProps}>
      <span className={cx("checkbox-wrap",{
        checked:checked
      })}>
        <input
          ref={(ref)=>{
            checkboxRef.current = ref;
            if ( ref && typeof props.ref == "function" ){
              props.ref(ref);
            }
          }}
          {...props}
          type="checkbox" checked={checked} 
          className={ cx("checkbox") }
          onChange={(e)=>{
            onChange(e.currentTarget.checked);
          }} id={id} aria-label={labelIsHidden ? label : undefined} />
          <span className={cx("checkmark")}>
            <FaCheck aria-hidden={true} />
          </span>
      </span>
      {(Boolean(label) && !labelIsHidden) && <span className={cx("label-text")}>{label}</span>}
    </ParentComponent>
  );
}