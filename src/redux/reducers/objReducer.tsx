export const objReducer =
	(def:any, id = '') =>
	(state:any=def, action: any) => {
		let temp = { ...state };
		switch (action.type) {
			case `SET${id}`:
				state = action.payload;
				break;

			case `SETKEY${id}`:
				temp[action.key] = action.payload;
				state = temp;
		}
		return state;
	};
