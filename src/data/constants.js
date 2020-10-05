// Unless we're overriding, WP REST API commonly sets a hard limit of 100 for the per_page parameter
export const MAX_PER_PAGE = 100;

/**
 * Query defaults for reporting.
 */
export const QUERY_DEFAULTS = {
	number: 20,
	offset: 0,
	orderby: 'ID',
	order: 'DESC',
};

/**
 * Could pull this from groundhogg.rest_base, but as the API base isn't _necessarily_ what we
 * want for a datastore namespace, keeping separate for now.
 */
export const NAMESPACE = 'gh/v4';