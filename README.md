# 🌌 ANTIGRAVITY: Automated Excel-to-Outlook Dispatch Protocol

> Defy manual data entry. Elevate your workflow.
> This repository contains the `Antigravity-Dispatch.zip` Power Automate package. It executes a seamless, zero-friction orbital drop of your daily Excel dispatch metrics directly into your Outlook inbox every morning at 10:30 AM.

## ⚙️ Core Telemetry (Data Schema)
The payload requires an Excel file formatted as a Table with the following exact headers to maintain structural integrity:
`party name` | `im_descr` | `im_qty` | `despqty` | `blockqty` | `your_ref` | `your_date` | `im_code` | `im_ordrate`

## 🚀 Deployment Sequence

1. **Clone the Payload:** Download the `Antigravity-Dispatch.zip` package from this repository.
2. **Access the Terminal:** Navigate to [Power Automate](https://make.powerautomate.com/).
3. **Initiate Import:** Go to **My flows** > **Import** > **Import Package (Legacy)** and upload the `.zip` file.
4. **Establish Connections:** 
   * During the import setup, authenticate the links to your **Excel Online** and **Office 365 Outlook** environments.
   * Point the flow's target coordinates to your specific Excel file and Table.
5. **Engage Thrusters:** Save the flow and toggle it to **On**. 

## 🛰️ Operational Output
Once activated, the system operates autonomously. At exactly 10:30 AM local time, the engine parses the `despqty` (Dispatch Quantity) against the `party name` and `im_code`, compiling an HTML matrix. The final payload is injected directly into your Outlook terminal. 

*Zero gravity. Zero manual reporting.*
