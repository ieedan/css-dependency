import { describe, expect, it } from 'vitest';
import * as css from '../src/index';

describe('parse', () => {
	it('Correctly parses imports', () => {
		const code = `@import "tailwindcss";
@import "./another.css";
@import url("./another.css");
@plugin "@tailwindcss/typography";
@config "./tailwind.config.ts";
@reference "./app.css";
@import url("./some.css") layer(layer-name);
@import "./some-more.css" layer(layer-name);`;

		expect(css.parse(code).unwrap()).toStrictEqual([
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
				raw: '@import url("./some.css") layer(layer-name);',
				directive: '@import',
				module: './some.css',
			},
			{
				raw: '@import "./some-more.css" layer(layer-name);',
				directive: '@import',
				module: './some-more.css',
			},
		]);
	});

	it('Allows tailwind directives when allowTailwindDirectives is true', () => {
		const code = `@import "tailwindcss";
@import "./another.css";
@import url("./another.css");
@plugin "@tailwindcss/typography";
@config "./tailwind.config.ts";
@reference "./app.css";
@import url("./some.css") layer(layer-name);
@import "./some-more.css" layer(layer-name);`;

		expect(css.parse(code, { allowTailwindDirectives: true }).unwrap()).toStrictEqual([
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
			{
				raw: '@import url("./some.css") layer(layer-name);',
				directive: '@import',
				module: './some.css',
			},
			{
				raw: '@import "./some-more.css" layer(layer-name);',
				directive: '@import',
				module: './some-more.css',
			},
		]);
	});

	it('Errors when unable to parse module', () => {
		expect(css.parse("@import url('some.css';").isErr()).toBe(true);
		expect(css.parse("@import 'some.css;").isErr()).toBe(true);
	});

	it('Expect to skip error when ignoreErrors is set to true', () => {
		expect(css.parse("@import url('some.css';", { ignoreErrors: true }).isErr()).toBe(false);
		expect(css.parse("@import 'some.css;", { ignoreErrors: true }).isErr()).toBe(false);
	});
});
