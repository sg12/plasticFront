export const getPageCount = (totalCount, limit) => {
	const pagesCount = Math.ceil(totalCount / limit);
	return pagesCount;
};

export const getPageArray = (totalPages) => {
	let result = [];
	for (let i = 0; i < totalPages; i++) {
		result.push(i + 1);
	}
	return result;
};