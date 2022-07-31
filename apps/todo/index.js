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
// function Subject(){
//     return <div>
//         <input type=""/>
//     </div>
// }

function App(){

    const [names, addNames] = React.useState(getData("todos"));
    const [name, setName] = React.useState("")

    function removeName(index){
        let filtered =names.filter((n,i) => i != index);
        setData("todos", filtered);
        addNames(filtered);
    }
    function addName(name){
        let myname = name.trim()
        if(myname === "" || myname === undefined) return;
        let new_names = [...names, name]
        addNames(new_names)
        setName("");
        setData("todos", new_names);
    }

    return <div className="App">
        <div className="form">
            <textarea onChange={e => setName(e.target.value)} value={name}/>
            <button onClick={e => addName(name)}> <i className="fa fa-plus" aria-hidden="true"></i>  </button>
        </div>
        <div className="todo-entries">
        {
            names.map((subject,i) => {
                return <div key={i} className={"todo-entry"}>
                        {subject} <button onClick={e => removeName(i)}><i class="fa fa-close"></i></button>
                    </div>
            })
        }
        </div>
    </div>;
}

root.render(<App/>)