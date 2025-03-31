import React from 'react'

/**
 * Loader component  is a simple loading spinner component that can be used to indicate loading states
 * It renders a CSS-based animation that can be styled via the `loader-animate-division` and 
 * `loader` class names. This component is useful for displaying a visual cue to the user during data fetching or processing.
 */

const Loader = () => {
  return (
    <div className="loader-animate-division">
    <div className="loader"></div>
  </div>
  )
}

export default Loader