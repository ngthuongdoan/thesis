import Vue from "vue";
import Vuex from "vuex";
import * as currencyModule from "./modules/currency";
import * as userModule from "./modules/user";
import * as modalModule from "./modules/modal";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		userModule,
		currencyModule,
		modalModule,
	}
});
