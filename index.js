const _ = require( "lodash");
const  {result}  = require("./ContactResult");

const wspContactMap = result.reduce((contactMap, contact) => {
    let wspPhones;
    if(!_.isEmpty(contact.phone)) {
        wspPhones =  contact.phone
            .filter((phoneItem) => (phoneItem.account_name.toLowerCase().includes("whatsapp")));
    }

    if(!_.isEmpty(wspPhones)){
        wspPhones.forEach(wspPhoneItem => contactMap[wspPhoneItem.number] =
                {
                    "display_name": contact.display_name,
                    "number": wspPhoneItem.number
                });
    }
    return contactMap;

},{});

console.log("Todos los contactos filtrados", wspContactMap);
console.log("Contacto por key", wspContactMap["+1754201111"]);
