
/**
 * @ngdoc controller
 * @name Settings
 * @description 
 * Settings.js
 * Holds variables
 * Always generates new object for spesific variable with defined value.
 */

var Settings = {};



/* VERSION */
Settings.VERSION = "0.8.5";


 /* IP & URL */
Settings.debugIP = "192.168.1.241/";       //localHost ip
//Settings.debugIP = "https://192.168.43.151/";    // Honor 6 ip
Settings.apiURL = "";

/* API COMMANDS */
Settings.Post = "Post;"
Settings.Get = "Get";

/* COLORS */
Settings.COLOR_OK = "#3695ff";
Settings.COLOR_SEMI_OK = "#f8a700";
Settings.COLOR_NOT_OK = "#FF0000";

/* LOADING SPINNER */
Settings.LOADING_SPINNER_DELAY = 250; // The delay after which the loading spinner appears

/* PLATFORMS */
Settings.PLATFORM_ANDROID = "Android";
Settings.PLATFORM_IOS = "IOS";
Settings.PLATFORM_WEBVIEW = "WebView";
Settings.PLATFORM_WINDOWS = "Windows";
Settings.PLATFORM_BROWSER = "Browser";

/* TASK COLORS */
Settings.TASK_CODING_COLOR = "#000000";
Settings.TASK_DESIGN_COLOR = "#000000";
Settings.TASK_PRESENTATION_COLOR = "#000000";
Settings.TASK_OTHER_COLOR = "#000000";

/* TASK ENUMERATES */
Settings.TASK_CODING_ENUM = 0;
Settings.TASK_DESIGN_ENUM = 1;
Settings.TASK_PRESENTATION_ENUM = 2;
Settings.TASK_OTHER_ENUM = 3;

/* TASK STRINGS */
Settings.TASK_CODING_STR = "Coding";
Settings.TASK_DESIGN_STR = "Design";
Settings.TASK_PRESENTATION_STR = "Presentation";
Settings.TASK_OTHER_STR = "Other";

/* TIMEOUTS */
Settings.TIMEOUT_SHORT = 20000;
Settings.TIMEOUT_MEDIUM = 30000;
Settings.TIMEOUT_LONG = 60000;
Settings.TIMEOUT_EXTRA_LONG = 120000;
