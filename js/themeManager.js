/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, document, CSInterface*/

var themeManager = (function () {
    'use strict';

    /**
     * Convert the Color object to string in hexadecimal format;
     */
    function toHex(color, delta) {

        function computeValue(value, delta) {
            var computedValue = !isNaN(delta) ? value + delta : value;
            if (computedValue < 0) {
                computedValue = 0;
            } else if (computedValue > 255) {
                computedValue = 255;
            }

            computedValue = Math.floor(computedValue);

            computedValue = computedValue.toString(16);
            return computedValue.length === 1 ? "0" + computedValue : computedValue;
        }

        var hex = "";
        if (color) {
            hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
        }
        return hex;
    }


    function reverseColor(color, delta) {
        return toHex({
            red: Math.abs(255 - color.red),
            green: Math.abs(255 - color.green),
            blue: Math.abs(255 - color.blue)
        },
            delta);
    }

    var rules = '';

    function addRule(stylesheetId, selector, rule) {
        var stylesheet = document.getElementById(stylesheetId);

        if (stylesheet) {
            stylesheet = stylesheet.sheet;
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
    }



    /**
     * Update the theme with the AppSkinInfo retrieved from the host product.
     */
    function updateThemeWithAppSkinInfo(appSkinInfo) {

        var panelBgColor = appSkinInfo.panelBackgroundColor.color;
        var bgdColor = toHex(panelBgColor);

        var eltBgdColor =  toHex(panelBgColor, 20);
        var inputBgColor =  toHex(panelBgColor, 100);

        var fontColor = "F0F0F0";
        var inputColor = "000000";
        if (panelBgColor.red > 122) {
            fontColor = "000000";
            // inputColor = "F0F0F0";
            $('#main').addClass('light-ui');

        }else {
            $('#main').removeClass('light-ui');
        }



        var borderColor = toHex(panelBgColor, -100);

        var gradTop = eltBgdColor;
        var gradBottom = bgdColor;
        var grad = "-webkit-gradient(linear, left top, left bottom, from(#"+gradTop+"), to(#"+gradBottom+"))";



        var styleId = "mainStyle";
        addRule(styleId, "body", "background-color:" + "#" + bgdColor);
        addRule(styleId, "body", "font-size:" + appSkinInfo.baseFontSize + "px;");
        addRule(styleId, "body", "font-family:" + appSkinInfo.baseFontFamily);
        addRule(styleId, "body", "color:" + "#" + fontColor);
        addRule(styleId, "input[type='text']", "color:" + "#" + inputColor);
        addRule(styleId, "input[type='text']", "background-color:" + "#" + inputBgColor);

        addRule(styleId, "button", "background-color:" + "#" + eltBgdColor);
        addRule(styleId, "button", "background-image:" + "-webkit-gradient(linear, left top, left bottom, from(#"+gradTop+"), to(#"+gradBottom+"))");
        addRule(styleId, "button:hover", "background-color:" + "#" + bgdColor);
        addRule(styleId, "button:active", "background-color:" + "#" + eltBgdColor);
        addRule(styleId, "button", "border-color: " + "#" + borderColor);





    }


    function onAppThemeColorChanged(event) {
        var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
        updateThemeWithAppSkinInfo(skinInfo);
    }


    function init() {

        var csInterface = new CSInterface();

        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);

        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
    }

    return {
        init: init
    };

}());
