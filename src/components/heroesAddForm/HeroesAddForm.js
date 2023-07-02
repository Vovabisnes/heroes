import { useHttp } from '../../hooks/http.hook';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { heroAdded, heroesFetchingError} from '../../actions';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../spinner/Spinner';

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state.filters);
    const { request } = useHttp();
    const dispatch = useDispatch();

    const addHero = (values) => {
        const newHero = {
            id: uuidv4(),
            ...values
        };

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(data => dispatch(heroAdded(data)))
            .catch(() => dispatch(heroesFetchingError()));
    };

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading Error</h5>
    }

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">No filters yet!</h5>
        }

        return arr.map(({name, id}) => {
            return (
                <option value={name === 'all' ? '' : name} key={id}>
                  {name}
                </option>
              );
        })
    }

    const elements = renderFiltersList(filters);
    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                element: '',
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .min(2, 'Minimum 2 symbols')
                    .required('Required field!'),
                description: Yup.string()
                    .required('Required field!'),
                element: Yup.string().required('Choose your element')
            })}
            onSubmit={(values, { resetForm }) => {
                addHero(values);
                resetForm();
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">New hero's name</label>
                    <Field
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="What is your name?" />
                    <ErrorMessage component="div" className="error" name="name"  style={{ color: 'red' }}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-4">Description</label>
                    <Field
                        name="description"
                        className="form-control"
                        id="description"
                        placeholder="What can I do?"
                        style={{ "height": '130px' }} />
                    <ErrorMessage component="div" className="error" name="description"  style={{ color: 'red' }}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Choose a hero element</label>
                    <Field
                        className="form-select"
                        id="element"
                        name="element"
                        as="select">
                        {elements}
                    </Field>
                    <ErrorMessage component="div" className="error" name="element"  style={{ color: 'red' }}/>
                </div>

                <button type="submit" className="btn btn-primary">Create</button>
            </Form>
        </Formik>
    )
}


export default HeroesAddForm;