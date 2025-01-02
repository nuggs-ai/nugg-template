// Custom plugin used to isolate styles. Inspired by:
// https://medium.com/@alpgokcek/managing-scoped-styles-in-module-federation-9879b25b0746
import { Plugin, Root, Rule, AtRule } from 'postcss';

interface WrapSelectorOptions {
	wrapper?: string;
}

const wrapSelector = (opts: WrapSelectorOptions = {}): Plugin => {
	const wrapper = opts.wrapper || '#nugg-wrapper';

	// console.log('🔵 Initializing wrapselector plugin with options:', { wrapper });

	return {
		postcssPlugin: 'wrapselector',
		Once(root: Root) {
			// console.log('🟡 wrapselector Root transform called:', {
			//     type: root.type,
			//     nodes: root.nodes,
			// });

			// Handle media queries
			root.walkAtRules('media', (atRule: AtRule) => {
				// console.log('🟦 Processing media query:', atRule.params);
				atRule.walkRules((rule: Rule) => {
					// console.log('🟨 Processing rule in media query:', {
					//     selector: rule.selector,
					//     mediaQuery: atRule.params
					// });

					if (!rule.selector) {
						// console.log('⚪ Skipping media query rule - no selector');
						return;
					}

					if (rule.selector === ':root') {
						rule.selector = wrapper;
						// console.log('🔵 Transformed :root to wrapper in media query:', wrapper);
						return;
					}

					if (!rule.selector.includes(wrapper)) {
						const oldSelector = rule.selector;
						rule.selector = `${wrapper} ${rule.selector}`;
						// console.log('🔴 Updated media query selector:', {
						//     from: oldSelector,
						//     to: rule.selector,
						//     media: atRule.params
						// });
					}
				});
			});

			// Handle regular rules
			root.walkRules((rule: Rule) => {
				if (rule.parent?.type === 'atrule' && (rule.parent as AtRule).name !== 'layer') {
					// console.log('⏭️ Skipping rule inside at-rule:', rule.parent.name);
					return;
				}

				// console.log('🟢 Processing rule:', {
				//     selector: rule.selector,
				//     parent: rule.parent?.type,
				//     type: rule.type
				// });

				if (!rule.selector) {
					// console.log('⚪ Skipping rule - no selector');
					return;
				}

				if (rule.selector === ':root') {
					rule.selector = wrapper;
					// console.log('🔵 Transformed :root to wrapper:', wrapper);
					return;
				}

				if (!rule.selector.includes(wrapper)) {
					const oldSelector = rule.selector;
					rule.selector = `${wrapper} ${rule.selector}`;
					// console.log('🔴 Updated selector:', {
					//     from: oldSelector,
					//     to: rule.selector
					// });
				} else {
					// console.log('⚪ Skipping rule - already wrapped:', rule.selector);
				}
			});

			// Handle @layer rules
			root.walkAtRules('layer', (atRule: AtRule) => {
				// console.log('🟨 Processing @layer rule:', atRule.params);
				atRule.walkRules((rule: Rule) => {
					// console.log('🟢 Processing rule inside @layer:', {
					//     selector: rule.selector,
					//     parent: rule.parent?.type,
					//     type: rule.type
					// });

					if (!rule.selector) {
						// console.log('⚪ Skipping rule - no selector');
						return;
					}

					if (rule.selector === ':root') {
						rule.selector = wrapper;
						// console.log('🔵 Transformed :root to wrapper:', wrapper);
						return;
					}

					if (!rule.selector.includes(wrapper)) {
						const oldSelector = rule.selector;
						rule.selector = `${wrapper} ${rule.selector}`;
						// console.log('🔴 Updated selector inside @layer:', {
						//     from: oldSelector,
						//     to: rule.selector
						// });
					} else {
						// console.log('⚪ Skipping rule inside @layer - already wrapped:', rule.selector);
					}
				});
			});
		}
	};
};

wrapSelector.postcss = true;

export default wrapSelector;
