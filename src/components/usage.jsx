import {NativeModules} from 'react-native';

const {ScreenTimeModule} = NativeModules;

console.log('ScreenTimeModule:', ScreenTimeModule);

export const getUsage = async () => {
if(!ScreenTimeModule) {
console.error('ScreenTimeModule is not available')
return;
}
try {
const usage = await ScreenTimeModule.getUsage();
console.log('Screen Time Usage:', usage);
return usage;
} catch (error) {
console.error('Error getting screen time usage:', error);}
}