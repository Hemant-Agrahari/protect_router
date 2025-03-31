import { useState, useEffect } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show or hide the button based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    })
  }

  useEffect(() => {
    // Add the scroll event listener
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      // Clean up the event listener
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div className="loginSignUp-btn" style={{ marginLeft: '12px' }}>
      {isVisible && (
        <button type="button" className="btn backtopbtn" onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </button>
      )}
    </div>
  )
}

export default BackToTop
