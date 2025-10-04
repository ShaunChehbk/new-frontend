import { useEffect, useState, useContext } from "react";
import APIContext from "../../context/APIProvider";
import { handleError } from "../../context/APIProvider";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";

const ContactManager = () => {

    const {useRequest} = useContext(APIContext)
    const [contactList, setContactList] = useState(null)
    const getAllContact = useRequest('getAllContact')

    useEffect(() => {
        getAllContact(response => setContactList(response.data), handleError)
        subscribe("newContactCreated", (event) => {
            setContactList(list => ([...list, event.detail]))
        })
        return () => unsubscribe("newContactCreated")
    }, [])

    const handleSubmit = (event) => {

    }
    return (
        <>
        <AddContact pParentHandleSubmit={handleSubmit}/>
        <ContactList pList={contactList}/>
        </>
    )
}

const AddContact = ({ pParentHandleSubmit }) => {
    const [content, setContent] = useState("")
    const {useRequest} = useContext(APIContext)
    const addNewContact = useRequest('addNewContact')

    const handleSubmit = (event) => {
        addNewContact({content}, handleSubmitSuccess, handleError)
    }

    const handleSubmitSuccess = (response) => {
        console.log("addNewContact return success")
        console.log(response)
        if (response.status === 201) {
            setContent("")
            publish("newContactCreated", response.data)
        }
    }


    return (
        <div>
            <textarea
                value={content}
                onChange={ e => setContent(e.target.value) }
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

const ContactView = ({ pContact }) => {
    const [contact, setContact] = useState(pContact)
    return (
        <div key={contact.id} contact-id={contact.id}>
        {contact.content}
        </div>
    )
}

const ContactList = ({ pList }) => {
    const [constackList, setContactList] = useState(pList)
    useEffect(() => {
        setContactList(pList)
    }, [pList])

    if (!constackList) { return }

    console.log(constackList)

    return (
        <div>
        {constackList.map((contact) => (<ContactView pContact={contact}/>))}
        </div>
    )
}

export default ContactManager