import { useMemo } from "react";

export const useSortedPosts = (posts, sort) => {
	const sortedPosts = useMemo(() => {
		if (sort) {
			return [...posts].sort((a, b) => {
				if (sort === 'id') {
					return a['id'] - b['id'];
				} else if (sort === 'idReverse') {
					return b['id'] - a['id'];
				} else {
					return a[sort].localeCompare(b[sort]);
				}
			});
		}
		return posts;
	}, [sort, posts]);

	return sortedPosts;
};

export const usePosts = (posts, sort, query) => {
	const sortedPosts = useSortedPosts(posts, sort);

	const sortedAndSearchedPosts = useMemo(() => {
		return sortedPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()));
	}, [query, sortedPosts]);

	return sortedAndSearchedPosts;
};