// Central re-exports for component library
// Usage:
//   import { Banner, Button } from 'react-libs/components'
//   or
//   import Banner from 'react-libs/components/Banner'

export { default as Banner } from './Banner'
export { default as Button } from './Button'


// If you REALLY want a default export too, do this instead:
// import Banner from './Banner';
// import Button from './Button';
// export { Banner, Button };
// export default { Banner, Button };