�}�~ X  ����T��u
����dպ&�=�?�oX��C��V�n	1��U����^�W^�V�SKz��Y)�l��I���z��i5
j2,�L ɘ )v��8Ӝ�)��g�Z�8k��p ��0�5j*�IÔ�"��18�Pՠp��-�t�{o5ly���v�4��rS4}��V�;Y�T����0r9��,~r�ݏ�y����k��W�Nf��?��)�4fcW���(%��ѱ�9Hj�B[����A��y�֯�Σr�����v;)u�?3X����ׁꦋP�7��,��W���\@OyA`b��z�Y�؋੕/X�-�K�SnF�0�����q�H��:an��mZt� �[����J��?�T��݆ݗz,�;q���%�U!@�nzi�+bϢ���@�-w+���|�D�ƶ��z,!��P��=Ӳ�
��>���N0e/	���G�q���w�o��8�P4]���+r�y��F�'hgth; index++) {
                const element = children[index];
                if (element.id == shiftid){
                    if(dev_id){
                        element.dev_id = dev_id;
                    }
                    departmentData = element;
                    break;
                }
            }
            return departmentData;
         
    }

  

}

module.exports =  new DeviceStatisticUtil();