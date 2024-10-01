'use client';
import Link from 'next/link';
import "./TranslateStyle.css";
import { useEffect, useState } from 'react';
import { Elsie_Swash_Caps } from 'next/font/google';

const Translate = () => {
    const [scriptAppended, setScriptAppended] = useState(false);

    useEffect(() => {
        const scriptId = 'google-translate-script';

        // Check if the script has already been appended
        if (scriptAppended) {
            const addScript = document.createElement('script');
            addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
            addScript.id = scriptId;
            document.body.appendChild(addScript);
            window.googleTranslateElementInit = googleTranslateElementInit;
        }
        else{
            setScriptAppended(true);
        }
    }, [scriptAppended]);

    const googleTranslateElementInit = () => {
        // Initialize the Google Translate plugin
        window.google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false,
        }, 'google_translate_element');
    }

    return (
        <div>
            <div id="google_translate_element"></div>
        </div>
    )
}

export default Translate;