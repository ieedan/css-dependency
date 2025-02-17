import * as l from '../utils/lines';
import * as s from '../utils/strings';

export type Import = {
	/** The @ directive used for the import */
	directive: string;
	/** The module that was imported */
	module: string;
	/** The code responsible for the import */
	raw: string;
};

export type Options = {
	/** Enable this to allow tailwind directives `@plugin`, `@config`, `@reference`
	 *
	 * @default false
	 */
	allowTailwindDirectives: boolean;
};

const TAILWIND_DIRECTIVES = ['@plugin', '@config', '@reference'];

/** Parses the css and returns any imports.
 *
 * @param code the code to be parsed
 * @param options parsing options
 * @returns
 *
 * ## Usage
 * ```ts
 * const code = '@import "./util.css";';
 *
 * const imports = parse(code);
 *
 * assert.deepStrictEqual(
 *      imports,
 *      [
 *          {
 *              directive: "@import",
 *              module: "./util.css",
 *              raw: '@import "./util.css";'
 *          }
 *      ]
 * );
 * ```
 */
export const parse = (
	code: string,
	{ allowTailwindDirectives = false }: Partial<Options> = {}
): Import[] => {
	const imports: Import[] = [];

	const directives = ['@import'];

	if (allowTailwindDirectives) {
		directives.push(...TAILWIND_DIRECTIVES);
	}

	const lines = l.get(code);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (
			s.startsWithOneOf(
				line,
				directives.map((d) => `${d} `)
			)
		) {
			const [directive, moduleExpr] = line.split(' ');

			const imp: Import = {
				raw: line,
				directive,
				module: parseModule(moduleExpr),
			};

			imports.push(imp);
		}
	}

	return imports;
};

const parseModule = (moduleExpr: string): string => {
	if (moduleExpr.startsWith('url(')) {
		const index = moduleExpr.lastIndexOf(')');

		return moduleExpr.slice(5, index - 1);
	}

	// trims the quotes
	return moduleExpr.slice(1, moduleExpr.length - 2);
};
