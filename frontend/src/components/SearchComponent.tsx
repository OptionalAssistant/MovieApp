import React, { useState } from 'react';
import { Form, FormControl, ListGroup } from 'react-bootstrap';

const SearchComponent = () => {
  // Sample list of items to search through
  const items = [
    'Apple',
    'Banana',
    'Ananas',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const handleSearch = (event : any) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter items based on the search term
    const filtered = items.filter(item =>
      item.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <Form>
        <FormControl
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>

      {searchTerm && (
        <ListGroup style={{ marginTop: '10px', cursor: 'pointer' }}>
          {filteredItems.map((item, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => {
                setSearchTerm(item);
                setFilteredItems([]);
              }}
            >
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchComponent;