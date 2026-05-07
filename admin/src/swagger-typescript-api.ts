import { exec } from 'child_process';
import path from 'path';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { config } from 'dotenv';
config();

const PATH_TO_OUTPUT_DIR = path.resolve(process.cwd(), './src/data-contracts');
const PATH_TO_TEMP_DIR = path.join(PATH_TO_OUTPUT_DIR, '.tmp');
const execAsync = promisify(exec);

type SwaggerTypescriptApiPackageJson = {
  bin?: string | Record<string, string>;
};

const quoteArg = (value: string) => JSON.stringify(value);

const getSwaggerTypescriptApiCli = () => {
  const packageJsonPath = path.join(process.cwd(), 'node_modules', 'swagger-typescript-api', 'package.json');
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8')
  ) as SwaggerTypescriptApiPackageJson;

  const binPath =
    typeof packageJson.bin === 'string'
      ? packageJson.bin
      : packageJson.bin?.['swagger-typescript-api'];

  if (!binPath) {
    throw new Error('Unable to resolve swagger-typescript-api CLI path');
  }

  const cliPath = path.resolve(process.cwd(), 'node_modules', 'swagger-typescript-api', binPath);
  const supportsGenerateCommand = binPath.includes('dist/cli');

  return `${quoteArg(process.execPath)} ${quoteArg(cliPath)}${supportsGenerateCommand ? ' generate' : ''}`;
};

const logCommandOutput = (stdout: string, stderr: string) => {
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }

  if (stdout) {
    console.log(`Data-contract-generator: ${stdout}`);
  }
};

const runCommand = async (command: string) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    logCommandOutput(stdout, stderr);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`error: ${error.message}`);
    }
    throw error;
  }
};

const main = async () => {
  fs.mkdirSync(PATH_TO_TEMP_DIR, { recursive: true });

  if (!fs.existsSync(`${PATH_TO_OUTPUT_DIR}/backend`)) {
    fs.mkdirSync(`${PATH_TO_OUTPUT_DIR}/backend`, { recursive: true });
  }

  const outputPath = path.join(PATH_TO_OUTPUT_DIR, 'backend');
  const tempSwaggerPath = path.join(PATH_TO_TEMP_DIR, 'backend.swagger.json');
  const swaggerTypescriptApiCli = getSwaggerTypescriptApiCli();

  console.log('Downloading and generating api-docs for backend');
  await runCommand(
    `curl -o "${tempSwaggerPath}" "${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PATH}/swagger.json"`
  );
  await runCommand(
    `${swaggerTypescriptApiCli} --modular -p ${quoteArg(tempSwaggerPath)} -o ${quoteArg(outputPath)} --axios --clean-output --extract-enums`
  );

  fs.rmSync(tempSwaggerPath, { force: true });
  fs.rmSync(PATH_TO_TEMP_DIR, { recursive: true, force: true });
};

main();
