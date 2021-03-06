import { RuleTester } from 'eslint';

import rule from '../../../lib/rules/no-unused-class';

import { test } from '../../utils';

const ruleTester = new RuleTester();

ruleTester.run('no-unused-class', rule, {
  /*
     valid cases
   */
  valid: [
    /*
       dot notation and square brackets
       eg: s.foo and s['bar']
     */
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s['bar']}>
              <span className={s.bold}></span>
            </div>
          </div>
        );
      `,
    }),
    /*
       ignore global scope selector
     */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <span className="bar"></span>
          </div>
        );
      `,
    }),
    /*
       TODO:
       global scope ignore
     */
  ],
  /*
     invalid cases
   */
  invalid: [
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.bar}>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo, bold'
      ]
    }),
    /* ignored global scope selector class */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo'
      ]
    }),
    /* TODO: global block should also be ignored */
  ],
});
