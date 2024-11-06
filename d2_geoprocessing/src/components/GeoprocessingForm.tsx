import React, { useState } from "react";
import { request, Job } from "@esri/arcgis-rest-request"
import { CalciteButton, CalciteInputText, CalciteLabel, CalciteOption, CalciteSelect } from "@esri/calcite-components-react";

type GeoprocessingProps = {
    authentication: any
}


export const GeoprocessingForm: React.FC<GeoprocessingProps> = (_props: GeoprocessingProps) => {
    const { authentication } = _props;
    const [gpInfo, setGpInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [gpUrl, setGpUrl] = useState<string>(import.meta.env.VITE_GP1_URL);
    
    // Method to get the geoprocessing task info in JSON format
    const getGPInfo = async () => {
        setLoading(true);
        return request(gpUrl, {
            params: {
                f: 'json'
            },
            authentication
        }).then((response) => {
            setGpInfo(response);
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setLoading(false);
        });
    };

    // Method to execute the geoprocessing task with the form data 
    const executeGp = async (event: React.MouseEvent<HTMLCalciteButtonElement, MouseEvent>) => {
        setLoading(true);
        setError(null);
        // Get the form data as an object
        const formData = new FormData(event.currentTarget.closest('form') as HTMLFormElement);
        const formJson: { [key: string]: any } = {};
        formData.forEach((value, key) => {
            if (value != null && value !== '') {
                formJson[key] = value;
            }
        });

        // Submit the job using async/await syntax
        try {
            const job = await Job.submitJob({ url: gpUrl, authentication,
                params: {
                    f: 'json',
                    ...formJson
                }
            });
            // Set the results to the state
            setResults(await job.getAllResults());
        } catch (error) {
            // Set the error to the state if the task fails
            setError(error);
        } finally {
            // Set loading state to false when the task is done
            setLoading(false);
        }
        
    }
    // Set up the form input components based on the parameter type
    const getInputComponent = (param: any) => {
        if (param.choiceList) {
            return <div key={param.name}>
                <CalciteLabel>
                    {param.displayName}
                    <CalciteSelect label={param.displayName} name={param.name}>
                        <CalciteOption key='default' value="">-</CalciteOption>
                        {param.choiceList.map((choice: any) => {
                            return <CalciteOption key={choice} value={choice}>{choice}</CalciteOption>
                        })}
                    </CalciteSelect>
                </CalciteLabel>
            </div>
        } else {
            return <div key={param.name}>
                <CalciteLabel>
                    {param.displayName}
                    <CalciteInputText name={param.name}></CalciteInputText>
                </CalciteLabel>
            </div>
        }
    }

    const onInputChange = (event: React.ChangeEvent<HTMLCalciteInputTextElement> | React.ClipboardEvent<HTMLCalciteInputTextElement>) => {
        setTimeout(() => {
            const inputEl = event.target as HTMLCalciteInputTextElement;
            console.log(inputEl.value);
            setGpUrl(_ => inputEl.value);
        });
    };

    if (!authentication) {
        return <div className="container flex justify-center">
            <div>Please sign in...</div>
        </div>
    }

    return (
            <div className="container mx-auto my-6">
                    <div className="flex justify-between align-middle my-4">
                        <div className="text-2xl">Geoprocessing Form</div>
                    </div>
                    <div className="flex flex-col my-4">
                        <CalciteLabel>
                            GP Service URL
                            <CalciteInputText id="gp-url-input" name="gp-url" value={gpUrl}
                                onChange={onInputChange}
                                onPaste={onInputChange}></CalciteInputText>
                        </CalciteLabel>
                        <CalciteButton onClick={getGPInfo}>Load form</CalciteButton>
                    </div>
                    <div>
                    {gpInfo && <form>
                        {
                            gpInfo.parameters.filter((p: any) => p.direction === 'esriGPParameterDirectionInput')
                            .map((param: any) => {
                                return getInputComponent(param);
                            })
                        }
                        <CalciteButton onClick={executeGp} loading={loading} disabled={loading||undefined}>Submit</CalciteButton>

                    </form>}
                    </div>
                    {results && <div>
                        <div className="text-2xl my-4">Results</div>
                        <pre className="border-2 my-2 overflow-auto">{JSON.stringify(results, null, 2)}</pre>    
                    </div>}
                    {error && <div>
                        <div className="text-2xl my-4">Error</div>
                        <pre className="border-2 my-2 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                    </div>}

            </div>
    )
}