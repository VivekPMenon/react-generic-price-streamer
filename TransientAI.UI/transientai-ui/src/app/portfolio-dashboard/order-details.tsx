import { Tabs } from "@radix-ui/themes";
import styles from './order-details.module.scss';

export function OrderDetails() {
  return (
    <div className='widget height-100p'>
      {/* <div className='widget-title'>Order Details</div> */}

      <Tabs.Root className='w-full height-100p' defaultValue='order'>
        <Tabs.List>
          <Tabs.Trigger
            value='order'
          >
            Order
          </Tabs.Trigger>
          <Tabs.Trigger
            value='audit'
          >
            Audit
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className={`${styles['order-details']}`} value='order'>
          <div className={`${styles['main-content']}`}>
            <div className={`${styles['first-column']}`} >
              <div className="form-field">
                <div className="form-label">Order ID</div>
                <div className="form-label-bold">234567_1</div>
              </div>

              <div className="form-field">
                <div className="form-label">Type</div>
                <div className="form-label-bold">CLST Interest</div>
              </div>

              <div className="form-field">
                <div className="form-label">Side</div>
                <div className="form-label-bold">Recieve</div>
              </div>

              <div className="form-field">
                <div className="form-label">Amount</div>
                <div className="form-label-bold">123,000$</div>
              </div>

              <div className="form-field">
                <div className="form-label">Settlement Currency</div>
                <div className="form-label-bold">USD</div>
              </div>

              <div className="form-field">
                <div className="form-label">CLearing Broker</div>
                <div className="form-label-bold">CLST</div>
              </div>
            </div>

            <div className={`${styles['second-column']}`} >

              <div className="form-field"></div>
              <div className="form-field">
                <div className="form-label">Posting Date</div>
                <div className="form-label-bold">2025-04-06</div>
              </div>

              <div className="form-field">
                <div className="form-label">Settle Date</div>
                <div className="form-label-bold">2025-04-08</div>
              </div>

              <div className="form-field">
                <div className="form-label">Accrual Start</div>
                <div className="form-label-bold">-</div>
              </div>

              <div className="form-field">
                <div className="form-label">Accrual End</div>
                <div className="form-label-bold">-</div>
              </div>


            </div>

            <div className={`${styles['third-column']}`} >
            
              <div className="form-field">
                <div className="form-label">CUSIP</div>
                <div className="form-label-bold orange-color underline cursor-p">
                  PO876tAGG
                </div>
              </div>

              <div className="form-field">
                <div className="form-label">TICKER</div>
                <div className="form-label-bold">MSFT</div>
              </div>

              <div className="form-field">
                <div className="form-label">Currency</div>
                <div className="form-label-bold">USD</div>
              </div>
            </div>
          </div>

          <div className={`${styles['action-buttons']}`} >
            <button className="button compact">Book</button>
            <button className="button compact">Edit</button>
            <button className="secondary-button compact">Cancel</button>
            <button className="secondary-button compact">Refresh</button>
          </div>
        </Tabs.Content>
        <Tabs.Content className='p-4' value='audit'>

        </Tabs.Content>
      </Tabs.Root>

    </div>
  )
}