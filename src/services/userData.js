import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import axios from 'axios';
export function getUserData() {
    let userData = JSON.parse(localStorage.getItem('userData'));
    
    if (navigator.userAgentData) {
        const platform = navigator.userAgentData.platform;
        console.log('Operating System:', platform);
    } else {
        console.log('User agent data not available');
    }

    const userLanguage = navigator.language;
    console.log('User Language:', userLanguage);

    const browserInfo = navigator.userAgent;
    console.log('Browser Info:', browserInfo);


    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenResolution = `${screenWidth}x${screenHeight}`;
    console.log('Screen Resolution:', screenResolution);

    if (!userData) {
        userData = {
            deviceType: null
        };

        if (isMobile) {
            userData.deviceType = 'mobile';
        } else if (isTablet) {
            userData.deviceType = 'tablet';
        } else if (isBrowser) {
            userData.deviceType = 'desktop';
        }
        console.log('Device Type:', userData.deviceType);

    }


    const getCityFromIP = async () => {
        try {
            const response = await axios.get('http://ip-api.com/json/');
            return response.data.city;
        } catch (error) {
            console.error('Ошибка при получении города по IP:', error);
            return null;
        }
    };

    getCityFromIP()
        .then(city => console.log('Город:', city))
        .catch(error => console.error('Ошибка:', error));

    return userData;
}