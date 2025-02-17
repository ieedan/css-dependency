import { describe, expect, it } from 'vitest';
import * as css from '../src/index';

describe('parse', () => {
	it('Correctly parses imports', () => {
		const code = `@import "tailwindcss";
@import "./another.css";
@import url("./another.css");
@plugin "@tailwindcss/typography";
@config "./tailwind.config.ts";
@reference "./app.css";`;

		expect(css.parse(code)).toStrictEqual([
			{
				raw: '@import "tailwindcss";',
				directive: '@import',
				module: 'tailwindcss',
			},
			{
				raw: '@import "./another.css";',
				directive: '@import',
				module: './another.css',
			},
			{
				raw: '@import url("./another.css");',
				directive: '@import',
				module: './another.css',
			},
		]);
	});

	it('Allows tailwind directives when allowTailwindDirectives is true', () => {
		const code = `@import "tailwindcss";
@import "./another.css";
@import url("./another.css");
@plugin "@tailwindcss/typography";
@config "./tailwind.config.ts";
@reference "./app.css";`;

		expect(css.parse(code, { allowTailwindDirectives: true })).toStrictEqual([
			{
				raw: '@import "tailwindcss";',
				directive: '@import',
				module: 'tailwindcss',
			},
			{
				raw: '@import "./another.css";',
				directive: '@import',
				module: './another.css',
			},
			{
				raw: '@import url("./another.css");',
				directive: '@import',
				module: './another.css',
			},
			{
				raw: '@plugin "@tailwindcss/typography";',
				directive: '@plugin',
				module: '@tailwindcss/typography',
			},
			{
				raw: '@config "./tailwind.config.ts";',
				directive: '@config',
				module: './tailwind.config.ts',
			},
			{
				raw: '@reference "./app.css";',
				directive: '@reference',
				module: './app.css',
			},
		]);
	});
});
