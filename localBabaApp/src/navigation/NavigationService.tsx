import { NavigationContainerRef, CommonActions } from '@react-navigation/native';

let _navigator: NavigationContainerRef<any> | null = null;

function setTopLevelNavigator(navigatorRef: NavigationContainerRef<any>) {
	_navigator = navigatorRef;
}

function navigate(routeName: string, params?: object) {
	if (_navigator) {
		_navigator.navigate(routeName, params);
	} else {
		console.warn('Navigator is not set.');
	}
}

function goBack() {
	if (_navigator) {
		_navigator.dispatch(CommonActions.goBack());
	} else {
		console.warn('Navigator is not set.');
	}
}

export default {
	navigate,
	setTopLevelNavigator,
	goBack,
};
