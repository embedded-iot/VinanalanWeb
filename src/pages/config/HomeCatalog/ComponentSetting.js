import React from 'react'

export const Input = props => {
    const {value, title, onChangeData, name, style, flex} = props;
    return (
        <div className="row" style={{marginBottom: '16px'}}>
            <div className={flex ? `col-lg-${flex.title}` : 'col-lg-4'}>
                <div className="add-modal-title">
                    <span>{title}</span>
                </div>
            </div>
            <div className={flex ? `col-lg-${flex.input}` : "col-lg-8"}>
                <input className="form-control"
                       value={value}
                       style={style}
                       type='text'
                       onChange={(e) => onChangeData(e)}
                       name={name}
                />
            </div>
        </div>
    )
}

export const Textarea = props => {
    const {value, title, onChangeData, name, style} = props;
    return (
        <div className="row" style={{marginBottom: '16px'}}>
            <div className="col-lg-4">
                <div className="add-modal-title"
                     style={styleInput}>
                    {title}
                </div>
            </div>
            <div className="col-lg-8">
                <textarea className="form-control"
                          value={value}
                          style={style}
                          type='text'
                          onChange={(e) => onChangeData(e)}
                          name={name}
                />
            </div>
        </div>
    )
}


export const Button = props => {
    const {onclick, title, style} = props;
    return (
        <button
            style={style}
            className="btn btn-finish"
            type="button"
            onClick={onclick}>
            {title}
        </button>
    );
}