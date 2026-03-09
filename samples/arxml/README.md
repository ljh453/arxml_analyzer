# Sample ARXML Set

Files:
- 00-datatypes.arxml
- 01-interfaces.arxml
- 02-application-swcs.arxml
- 03-cdd.arxml
- 04-composition.arxml
- 05-ecuc-bsw.arxml
- 06-bsw-services-all.arxml
- 07-bsw-communication-all.arxml
- 08-bsw-memory-all.arxml
- 09-bsw-ecu-abstraction-all.arxml
- 10-bsw-mcal-all.arxml

Model summary:
- ASW SWCs: SensorFusionSwc, VehicleControllerSwc, ActuatorManagerSwc
- CDD: PowerStageCdd
- BSW Service Component: DiagnosticServiceSwc
- Minimal BSW modules: IoHwAb, Dem, Dcm, Com, PduR, CanIf, NvM, Mcu
- Full BSW sample coverage: all BSW modules recognized by the current app

Interaction chain:
- SensorFusionSwc -> VehicleControllerSwc via VehicleState_I
- VehicleControllerSwc -> ActuatorManagerSwc via TorqueRequest_I
- ActuatorManagerSwc -> SensorFusionSwc via ActuatorFeedback_I
- ActuatorManagerSwc -> PowerStageCdd via IoHwCommand_I
- PowerStageCdd -> VehicleControllerSwc via PowerStageStatus_I
- DiagnosticServiceSwc -> VehicleControllerSwc via DiagnosticEvent_I

Full BSW coverage by file:
- 06-bsw-services-all.arxml: BswM, ComM, Det, Dem, Dcm, E2E, EcuM, FiM, StbM, WdgM, Crc, Csm, SecOC, Xcp, Os, SchM
- 07-bsw-communication-all.arxml: CanIf, CanTp, CanNm, CanSM, Com, ComXf, PduR, IpduM, SoAd, DoIP, Sd, TcpIp, UdpNm, Nm, LinIf, LinTp, LinSM, FrIf, FrTp, FrNm, EthIf, EthSM, J1939Tp
- 08-bsw-memory-all.arxml: NvM, MemIf, Fee, Ea, Eep
- 09-bsw-ecu-abstraction-all.arxml: IoHwAb, CanTrcv, EthTrcv, LinTrcv, FrTrcv, WdgIf, MemAcc
- 10-bsw-mcal-all.arxml: Adc, Can, Dio, Eth, Fls, Gpt, Icu, Lin, Mcu, Port, Pwm, Spi, Wdg, Ocu

Usage notes:
- Upload 00-10 together to test both application interaction parsing and full layered architecture classification.
- 05-ecuc-bsw.arxml is a small mixed BSW example.
- 06-10 provide exhaustive ECUC module coverage for the BSW categories recognized by the app.