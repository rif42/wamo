import { useState, useEffect } from "react";
import "./Home.css";

type MessageForm = {
    recipient: string;
    msg: string;
    targetDate: string;
};

function Home() {
    const [formData, setFormData] = useState<MessageForm>({
        recipient: "",
        msg: "",
        targetDate: "",
    });

    function checkDateValidity(date: FormDataEntryValue) {
        const target = new Date(Date.parse(String(date))).getTime();
        const now = new Date().getTime();
        if (target > now) {
            console.log("Date OK", target, now);
            return true;
        }
        console.log("Date in the past", target, now);
        alert("date is in the past");
        return false;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        //check date if its in the past
        if (!checkDateValidity(fd.get("targetDate")!)) return;

        //construct json payload
        const payload: MessageForm = {
            recipient: String(fd.get("recipient") ?? ""),
            msg: String(fd.get("msg") ?? ""),
            targetDate: new Date(String(fd.get("targetDate") ?? "")).toISOString(),
        };

        //sync payload with state
        setFormData({
            recipient: payload.recipient,
            msg: payload.msg,
            targetDate: payload.targetDate,
        });

        //c.log it
        const json = JSON.stringify(payload);
        console.log("final data", json);

        sendForm();
    }

    async function checkForm() {
        const res = await fetch("http://localhost:8080/forms", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        console.log("GET BACKEND", data);
    }

    async function checkFormByID(targetId: number) {
        const res = await fetch(`http://localhost:8080/forms/${targetId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        console.log("GET SPECIFIC ID", data);
    }

    async function sendForm() {
        const testdata = {
            recipient: "Donald Trump",
            message: "FUCK YOU",
            date: new Date().toISOString(),
        };

        const res2 = await fetch("http://localhost:8080/forms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testdata),
        });
        const resdata = await res2.json();
        console.log("POST BACKEND", resdata);
        checkForm();
    }

    useEffect(() => {
        checkForm();
        checkFormByID(1);
    }, []);

    return (
        <>
            <h1 className='text-2xl font-bold'>Welcome to Wamo!</h1> <br />
            <form onSubmit={handleSubmit} className='flex flex-col p-4 w-64 gap-1 bg-gray-100 rounded-md'>
                <label className='font-bold'>Recipient</label>
                <input className='bg-white rounded-md border-2 border-gray-300' type='text' name='recipient' required />

                <label className='font-bold'>Message</label>
                <textarea
                    className='bg-white rounded-md border-2 border-gray-300'
                    name='msg'
                    rows={10}
                    cols={30}
                    required
                    minLength={1}
                    maxLength={500}
                />

                <label className='font-bold'>Schedule</label>
                <input
                    className='bg-white rounded-md border-2 border-gray-300'
                    type='datetime-local'
                    name='targetDate'
                    required
                />

                <button
                    className=' bg-gray-500 text-white text-xl w-fit mt-4 py-2 px-4 font-bold rounded-2xl'
                    type='submit'>
                    Send
                </button>
            </form>
        </>
    );
}

export default Home;
