const LoadingSpinner = (props) => {
    return (
        <div className="loader" style={props.style}>
            <svg className="circular-loader" viewBox="25 25 50 50" >
                <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#f58986" strokeWidth={props.strokeWidth ? props.strokeWidth : "2"} />
            </svg>
        </div>
    )
}

export default LoadingSpinner