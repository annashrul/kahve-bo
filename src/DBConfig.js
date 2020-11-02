export const DBConfig = {
    name: 'backoffice_kahve',
    version: 1,
    objectStoresMeta: [
        {
            store: 'sess',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'id',keypath:'id',options:{unique:false}},
                { name: 'token',keypath:'token',options:{unique:false}},
                { name: 'name',keypath:'name',options:{unique:false}},
                { name: 'email',keypath:'email',options:{unique:false}},
                { name: 'status',keypath:'status',options:{unique:false}},
                { name: 'foto',keypath:'foto',options:{unique:false}},
                { name: 'created_at',keypath:'created_at',options:{unique:false}}
                
            ]
        },
    ]
};