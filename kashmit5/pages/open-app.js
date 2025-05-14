    // pages/open-app.js

    import { useEffect } from 'react';
    import Head from 'next/head';

    const RedirectToApp = () => {
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

        if (isAndroid) {
        // Try deep link with Android intent
        window.location.href =
            'intent://openapp#Intent;scheme=marwaapp;package=com.marwa.app;end;';
        } else if (isIOS) {
        // Try iOS deep link
        window.location.href = 'marwaapp://openapp';

        // Fallback to App Store after 2 seconds
        setTimeout(() => {
            window.location.href =
            'https://apps.apple.com/hu/app/marwa-foods/id6449415140';
        }, 2000);
        } else {
        // Fallback for desktop and unknown devices
        window.location.href = 'https://marwa.hu';
        }
    }, []);

    return (
        <>
        <Head>
            <title>Open Marwa App</title>
            <meta name="robots" content="noindex" />
        </Head>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Redirecting you to the Marwa app...</p>
            <p>
            If nothing happens, <a href="https://marwa.hu">click here</a>.
            </p>
        </div>
        </>
    );
    };

    export default RedirectToApp;
