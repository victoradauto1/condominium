"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICondominium__factory = exports.CondominiumAdapter__factory = exports.Condominium__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var Condominium__factory_1 = require("./factories/Condominium__factory");
Object.defineProperty(exports, "Condominium__factory", { enumerable: true, get: function () { return Condominium__factory_1.Condominium__factory; } });
var CondominiumAdapter__factory_1 = require("./factories/CondominiumAdapter__factory");
Object.defineProperty(exports, "CondominiumAdapter__factory", { enumerable: true, get: function () { return CondominiumAdapter__factory_1.CondominiumAdapter__factory; } });
var ICondominium__factory_1 = require("./factories/ICondominuim.sol/ICondominium__factory");
Object.defineProperty(exports, "ICondominium__factory", { enumerable: true, get: function () { return ICondominium__factory_1.ICondominium__factory; } });
//# sourceMappingURL=index.js.map