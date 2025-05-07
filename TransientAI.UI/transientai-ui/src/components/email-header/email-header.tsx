function EmailHeader() {
  return (
    <div className='email-header'>
      <div className='header-left'>
        <div className='avatar'>D</div>
        <div className='details'>
          <div className='sender'>
            David Kim via Otter.ai &lt;no-reply@otter.ai&gt;
          </div>
          <div className='recipient'>To: Vivek Menon</div>
        </div>
      </div>

      <div className='header-right'>
        <span className='time'>Fri 5/2/2025 12:03 PM</span>

        <div className='actions'>
          <button className='action-btn'>
            <i className='fa-solid fa-reply'></i>
            Reply
          </button>
          <button className='action-btn'>
            <i className='fa-solid fa-reply-all'></i>
            Reply all
          </button>
          <button className='action-btn'>
            <i className='fa-solid fa-share'></i>
            Forward
          </button>
          <button className='action-btn'>
            <i className='fa-solid fa-ellipsis'></i>
          </button>
        </div>
{/* 
        <div className='security-actions'>
          <button className='trust-btn'>Trust sender</button>
          <button className='show-btn'>Show blocked content</button>
        </div> */}
      </div>
    </div>
  );
}

export default EmailHeader;
