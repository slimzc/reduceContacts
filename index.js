const _ = require( "lodash");
const  {result}  = require("./ContactResult");
const Benchmark = require('benchmark');
const microtime = require('microtime');

class reduceContact {

    static wspContactMapUsingHOF() {
        const contacts = result.reduce((contactMap, contact) => {
            let wspPhones;
            if (!_.isEmpty(contact.phone)) {
                wspPhones = contact.phone
                    .filter((phoneItem) => (phoneItem.account_name.toLowerCase().includes("whatsapp")));
            }

            if (!_.isEmpty(wspPhones)) {
                wspPhones.forEach(wspPhoneItem => contactMap[wspPhoneItem.number] =
                    {
                        "display_name": contact.display_name,
                        "number": wspPhoneItem.number
                    });
            }
            return contactMap;

        }, {});
        return contacts;
    }

    static wspContactMapUsingFor() {
        let contact = result;
        let contactMap = new Object();
            for(let i = 0; i < contact.length;i++ ) {
                let phone =  new Array();
                if(!_.isEmpty(contact[i].phone)){
                    for (let j = 0; j < contact[i].phone.length;j++) {
                        if (contact[i].phone[j].account_name.toLowerCase().includes("whatsapp")) {
                            phone.push(contact[i].phone[j].number)
                        }
                    }
                }
                if(!_.isEmpty(phone)){
                    for(let j = 0; j < phone.length;j++){
                        contactMap[phone[j]] =
                            {
                                "display_name": contact[i].display_name,
                                "number": phone[j]
                            }
                    }
                }
            }
            return contactMap;


    }

    static benchmark(){
        let suite = new Benchmark.Suite("contacts");
        suite.add('ContactMap#WithHOF', reduceContact.wspContactMapUsingHOF())
            .add('ContactMap#WithFor', reduceContact.wspContactMapUsingFor())
            .on('complete', function() {
                var benchTest1 = this[0]; // gets benchmark for test1
                var benchTest2 = this[1]; // gets benchmark for test2

                console.log(benchTest1.toString()); // ops/sec
                // benchmark info in format:
                // test2 x 1,706,681 ops/sec ±1.18% (92 runs sampled)
                console.log(benchTest2.toString());

            })
            .run({'maxTime':5, 'delay':5,'async': true});
    }


}
let time1 = new Array();
for(let i = 0; i<100;i++){
    const t0 = microtime.now();
    reduceContact.wspContactMapUsingHOF();
    const t1 = microtime.now();
    time1.push(t1-t0);
}
const total1 = time1.reduce((sum,time) => sum + time);
console.log("Tiempo usando HOF:",total1, "μs");

time1 = new Array();
for(let i = 0; i<100;i++){
    const t0 = microtime.now();
    reduceContact.wspContactMapUsingFor();
    const t1 = microtime.now();
    time1.push(t1-t0);
}
const total2 = time1.reduce((sum,time) => sum + time);
console.log("Tiempo usando For:",total2,"μs\n");

console.log("Todos los contactos filtrados usando HOF\n", reduceContact.wspContactMapUsingHOF());
console.log("Contacto por key", reduceContact.wspContactMapUsingHOF()["+1754201111"],"\n");

console.log("Todos los contactos filtrados usando HOF\n", reduceContact.wspContactMapUsingFor());
console.log("Contacto por key", reduceContact.wspContactMapUsingFor()["+1754201111"]);
