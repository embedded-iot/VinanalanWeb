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
    const {value, title, onChangeData, name, style, flex} = props;
    return (
        <div className="row" style={{marginBottom: '16px'}}>
            <div className={flex ? `col-lg-${flex.title}` : 'col-lg-4'}>
                <div className="add-modal-title">
                    <span>{title}</span>
                </div>
            </div>
            <div className={flex ? `col-lg-${flex.input}` : "col-lg-8"}>
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

//
// const data = {
//     "roomId":"5c3c5b45bdb6b43970501d7a",
//         "customerId": "string",
//         "bookingSource": "string",
//         "checkin": "2019-01-15T07:02:57.355Z",
//         "checkout": "2019-01-15T07:02:57.355Z",
//         "guestNumber": 4,
//         "totalMoney": 0,
//         "description":"String", // Description
//         "prePay": 0
//     "userId":"5c35b8794109b335a4836832",//id của thằng book
//         "customerEmail":"{{link:0}}",
//         "customerName":"3343dsf",
//         "customerPhone":"23132",
//         "customerPassportId": "12313",
//         "customerCountry": "VN",
//         "extraInfo" :"dfdas"//Customer note
// }
//
// birthday