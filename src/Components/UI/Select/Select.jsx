import classes from "./Select.module.css";
const Select = (props) => {
  return (
    <div
      className={`${props.className} ${classes.inputContainer} `}
      style={props.style}
    >
      <label htmlFor={props.name} className={classes.label}>
        {props.label}
      </label>
      <select
        name={props.name}
        id={props.name}
        className={classes.Select}
        onChange={props.onChange}
      >
        {props.children}
      </select>
      <img src="/svg/arrow-left.svg" alt="arrow" className={classes.arrow} />
    </div>
  );
};

export default Select;
