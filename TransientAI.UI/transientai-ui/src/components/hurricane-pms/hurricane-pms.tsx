import { useDeviceType } from "@/lib/hooks";
import styles from "./hurricane-pms.module.scss";
import { DataGrid } from "@/components/data-grid";
import { columnDefs } from "./hurricane-pms-config";

export const HurricanePms = () => {
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

  return (
    <div className={`${styles["hurricane-pms"]} scrollable-div gap-4`}>
      <section className="flex h-[600px] gap-4 flex-1">
        <div className="w-[80%] flex gap-4">

          <section className="w-[70%]">
            <DataGrid 
                domLayout={'normal'}
                height={isMobile ? 500 : '95%'}
                isSummaryGrid={false}
                suppressStatusBar={true}
                suppressFloatingFilter={false}
                columnDefs={columnDefs}
            />
          </section>
          <section className="flex flex-col gap-4">
            <div>
              <DataGrid />
            </div>
            <div>
              <DataGrid />
            </div>
          </section>

        </div>

        <div className="">
          <section>charts</section>
          <section>charts</section>
        </div>
      </section>

      <section className="flex h-[600px] gap-4">
        <div className="w-[80%]">
          <DataGrid />
        </div>
        <div>charts</div>
      </section>
    </div>
  );
};
