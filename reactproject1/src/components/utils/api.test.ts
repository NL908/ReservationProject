import { fetchExecutionDetails } from './api.ts'

describe('StepFunctionApiGateway', () => {
    it('StepFunctionArnCall', async () => {
        const stepArn = "arn:aws:states:us-east-1:767397950342:execution:MyStateMachine-tdqdsfstd:48ee94fc-1d17-415f-893e-1f85b7042a48"
        const reservationData = await fetchExecutionDetails(stepArn)
        expect(reservationData[0].id).toBe(1)
        expect(reservationData[1].id).toBe(3)
    })
})