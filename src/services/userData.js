import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import axios from 'axios';

export async function getUserData() {
    let userData = JSON.parse(localStorage.getItem('userData'));
    const dataArray = [];

    if (navigator.userAgentData) {
        const platform = navigator.userAgentData.platform;
        dataArray.push({ key: 'Operating System', value: platform });
    } else {
        dataArray.push({ key: 'User agent data', value: 'not available' });
    }

    const userLanguage = navigator.language;
    dataArray.push({ key: 'User Language', value: userLanguage });

    const browserInfo = navigator.userAgent;
    dataArray.push({ key: 'Browser Info', value: browserInfo });

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenResolution = `${screenWidth}x${screenHeight}`;
    dataArray.push({ key: 'Screen Resolution', value: screenResolution });

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
        dataArray.push({ key: 'Device Type', value: userData.deviceType });
    }

    try {
        const response = await axios.get('http://ip-api.com/json/');
        const city = response.data.city;
        dataArray.push({ key: 'City', value: city });

        const ip = response.data.query;
        dataArray.push({ key: 'IP Address', value: ip });
    } catch (error) {
        console.error('Error fetching data from IP API:', error);
    }

    return dataArray;
}

async function fetchData() {
    const userDataArray = await getUserData();
    console.log(userDataArray);
}

fetchData();
