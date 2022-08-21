"use strict";

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
const store = localStorage;

function getData(key){
    let data = JSON.parse(store.getItem(key)) || []
    return data;
}
function setData(key, data){
    let str_data = JSON.stringify(data);
    store.setItem(key, str_data);
}


function App(){
    const [checks, setChecks] = React.useState(getData("checklist"));
    const [currentInput, setCurrentInput] = React.useState("");
    const [currentChecked, setCurrentChecked] = React.useState(false);

    const toggleCheck = i =>{
        checks[i].done = !checks[i].done;
        setChecks(checks)
        setData("checklist", checks)
    }
    const remove = text => {
        const data = checks.filter(check => check.text != text)
        setChecks(data)
        setData("checklist", data)
    }

    return <div className={"App"}>
        <h1 className={"center title"}>
                <img className="title-icon" 
                     src="./images/sign-check-icon.png"/>
                CheckList
        </h1>
        {
            checks.map((c,i) => {
                return <CheckItem  key={i} 
                                   text={c.text}
                                   done={c.done}
                                   onCheck={e => toggleCheck(i)}
                                   onRemove={e => remove(c.text) }  />
            })
        }
        <form onSubmit={e => {
                const data = [...checks, {text:currentInput, done:currentChecked}]
                setData("checklist", data)
                setChecks(data);
                setCurrentInput("");
                setCurrentChecked(false);
                e.preventDefault()
            }}
            className={"check-item"}
            >
            <CheckBox label={
                        <input className="check-ls-input"
                            type="text" 
                            placeHolder="add task here..."
                            onChange={e=> setCurrentInput(e.target.value)} 
                            value={currentInput}
                            contentEditable={true}/>
                    } 
                      className={currentChecked? "striked":"none"}
                      checked={currentChecked} 
                      onChecked={e => {
                        setCurrentChecked(!currentChecked)
                    }}
            />
            
        </form>
    </div>
}

function CheckItem({text, done, onCheck, onRemove}){

    const [checked, setChecked] = React.useState(done)
    const [removed, setRemoved] = React.useState(false);

    return <div className={"check-item" + (removed?" hide":"")}>
            <CheckBox label={text}
                      title="Click to mark as done"
                      className={checked? "striked":"none"}
                      checked={checked} 
                      onChecked={e => {
                        onCheck()
                        setChecked(!checked)
                    }}
            />
            {/* <label onChange={e => {
                        onCheck()
                        setChecked(!checked)
                    }} 
                   className={ checked? "striked":"none" }>
                    <input type="checkbox"
                        className="real-checkbox"
                        defaultChecked={checked}
                        />
                        {   
                            checked?
                            <i className="fa fa-check check-box"></i>:
                            <i className="fa fa-circle check-box"></i>
                        }
                    {text}
            </label> */}
            <span className={"remove-btn"}
                  title="remove"
                  onClick={e => {
                    onRemove(e)
                    setRemoved(true)
                  }}><i className="fa fa-close"></i></span>
        </div>
}


function CheckBox({checked, label, onChecked, className, title}){

    const onChange = e => {
        if(checked != e.target.checked)
        onChecked(e)
    }

    return <label onChange={onChange} 
                  className={className+ " "+ "pointer"}
                  title={title}>
        <input type="checkbox"
        className="real-checkbox"
        defaultChecked={checked}
        />
        {   
            checked?
            <i className="fas fa-check-circle check-box"></i>:
            <i className="fa fa-circle check-box"></i>
        }
        {label}
        </label>
}

root.render(<App/>)